import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getImg,
  getMovie,
  getPopularMovies,
  IMovie,
  useWindowWidth,
} from "../api";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Details from "../Components/Details";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
`;
const Loader = styled.div`
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Banner = styled.div<{ imgPath: string | undefined }>`
  width: 100vw;
  padding: 0 60px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.imgPath});

  background-size: cover;
`;

const Title = styled.h1`
  font-size: 80px;
  margin-bottom: 15px;
`;

const Overview = styled.p`
  width: 35%;
  font-size: 23px;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 200px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  width: 100%;
  position: absolute;
  top: 0;
  h1 {
    position: absolute;
    top: -50px;
    font-size: 32px;
    margin-left: 15px;
  }
`;

const Card = styled(motion.div)`
  background-color: white;
  color: black;
  height: 200px;
  border-radius: 10px;
  cursor: pointer;
  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
  &:first-child {
    transform-origin: left center;
  }
  &:last-child {
    transform-origin: right center;
  }
`;

const Info = styled(motion.div)`
  width: 100%;
  padding: 10px;
  text-align: center;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  color: ${(props) => props.theme.white.darker};
  position: absolute;
  bottom: -40px;
`;

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  opacity: 0;
  position: fixed;
  top: 0;
`;
const DetailWrapper = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.darker};
  border-radius: 10px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const SlideBtn = styled(motion.div)`
  width: 60px;
  height: 200px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
  svg {
    width: 40px;
    fill: rgba(255, 255, 255, 0.5);
  }
`;

const infoVar = {
  hover: {
    opacity: 1,
  },
};

const offset = 6;

const cardVar = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.5,
    y: -50,

    transition: {
      delay: 0.5,
      type: "tween",
      duration: 0.2,
    },
  },
};

function Home() {
  const [nowIndex, setNowIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const movieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  // params의 type 정해주지않으면 TS에서 params 쓸 수 없음.
  // movieMatch = {
  // isExact: true
  // params: {movieId: '280180'}
  // path: "/movies/:movieId"
  // url: "/movies/280180"
  // }
  const history = useHistory();
  const { data: movieData, isLoading: movieLoading } = useQuery<IMovie>({
    queryKey: ["movies", "now-playing"],
    queryFn: getMovie,
  });
  const { data: popularData, isLoading: popularLoading } = useQuery<IMovie>({
    queryKey: ["movies", "popular"],
    queryFn: getPopularMovies,
  });
  const width = useWindowWidth();

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const prevSlide = () => {
    if (leaving) return;
    toggleLeaving();
    setNowIndex((prev) => (prev === 1 ? 1 : prev - 1));
  };
  const nextSlide = () => {
    if (movieData) {
      const maxIndex = Math.ceil(movieData?.results.length / offset) - 1;
      if (leaving) return;
      toggleLeaving();
      setNowIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const prevPopular = () => {
    if (leaving) return;
    toggleLeaving();
    setPopularIndex((prev) => (prev === 1 ? 1 : prev - 1));
  };

  const nextPopular = () => {
    if (popularData) {
      const maxIndex = Math.ceil(popularData?.results.length / offset) - 1;
      if (leaving) return;
      setLeaving((prev) => !prev);
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const showBigScreen = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };
  const backToMain = () => {
    history.push("/");
  };
  const { scrollY } = useScroll();

  return (
    <>
      {movieLoading ? (
        <Loader>
          <h1>Loading...</h1>
        </Loader>
      ) : (
        <Wrapper>
          <>
            <Banner imgPath={getImg(movieData?.results[0].backdrop_path || "")}>
              <Title>{movieData?.results[0].title}</Title>
              <Overview>{movieData?.results[0].overview}</Overview>
            </Banner>
            <Slider>
              <AnimatePresence
                initial={false}
                mode="sync"
                onExitComplete={toggleLeaving}
              >
                <Row
                  key={nowIndex}
                  initial={{ x: width - 10 }}
                  animate={{ x: 0 }}
                  exit={{ x: -width + 10 }}
                  transition={{ duration: 1, type: "just" }}
                >
                  <h1>Now Playing &rarr;</h1>
                  {movieData?.results
                    .slice(1)
                    .slice(offset * nowIndex, offset * (nowIndex + 1))
                    .map((movie) => (
                      <Card
                        layoutId={movie.id + ""}
                        onClick={() => showBigScreen(movie.id)}
                        variants={cardVar}
                        initial="initial"
                        whileHover="hover"
                        transition={{ type: "tween" }}
                        key={movie.id}
                      >
                        <motion.img
                          src={getImg(movie.poster_path, "w500")}
                          alt="poster"
                        />
                        <Info variants={infoVar}>
                          <h4>{movie.title}</h4>
                        </Info>
                      </Card>
                    ))}
                  <SlideBtn
                    whileHover={{ opacity: 1 }}
                    style={{ position: "absolute", left: 0, zIndex: 10 }}
                    onClick={prevSlide}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                    </svg>
                  </SlideBtn>
                  <SlideBtn
                    whileHover={{ opacity: 1 }}
                    style={{ position: "absolute", right: 0, zIndex: 10 }}
                    onClick={nextSlide}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                    </svg>
                  </SlideBtn>
                </Row>

                {popularLoading ? (
                  <Loader>
                    <h1>Loading...</h1>
                  </Loader>
                ) : (
                  <Row
                    style={{ top: 300 }}
                    key={popularIndex}
                    initial={{ x: width - 10 }}
                    animate={{ x: 0 }}
                    exit={{ x: -width + 10 }}
                    transition={{ duration: 1, type: "just" }}
                  >
                    <h1>Popular &rarr;</h1>
                    {popularData?.results

                      .slice(offset * popularIndex, offset * (popularIndex + 1))
                      .map((movie) => (
                        <Card
                          layoutId={movie.id + ""}
                          onClick={() => showBigScreen(movie.id)}
                          variants={cardVar}
                          initial="initial"
                          whileHover="hover"
                          transition={{ type: "tween" }}
                          key={movie.id}
                        >
                          <motion.img
                            src={getImg(movie.poster_path, "w500")}
                            alt="poster"
                          />
                          <Info variants={infoVar}>
                            <h4>{movie.title}</h4>
                          </Info>
                        </Card>
                      ))}
                    <SlideBtn
                      whileHover={{ opacity: 1 }}
                      style={{ position: "absolute", left: 0, zIndex: 10 }}
                      onClick={prevPopular}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                      </svg>
                    </SlideBtn>
                    <SlideBtn
                      whileHover={{ opacity: 1 }}
                      style={{ position: "absolute", right: 0, zIndex: 10 }}
                      onClick={nextPopular}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                      >
                        <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                      </svg>
                    </SlideBtn>
                  </Row>
                )}
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {movieMatch ? (
                <>
                  <Overlay
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    // without this, frame looks stiff.
                    onClick={backToMain}
                  />
                  <DetailWrapper
                    style={{ top: scrollY.get() + 50, overflowY: "auto" }}
                    layoutId={movieMatch.params.movieId}
                  >
                    <Details movieId={movieMatch.params.movieId} />
                  </DetailWrapper>
                </>
              ) : null}
            </AnimatePresence>
          </>
        </Wrapper>
      )}
    </>
  );
}

export default Home;
