import { useQuery } from "@tanstack/react-query";
import { getImg, getMovieDetails, IMovieDetails } from "../api";
import styled from "styled-components";
import { motion } from "framer-motion";

const Loader = styled.div`
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const DetailImg = styled.div<{ imgPath: string | undefined }>`
  width: 100%;
  height: 400px;
  background-image: linear-gradient(rgba(24, 24, 24, 0), rgba(24, 24, 24, 1)),
    url(${(props) => props.imgPath});
  background-size: cover;
`;

const DetailInfo = styled.div`
  position: relative;
  padding: 30px;
  top: -200px;
`;

const Title = styled.div`
  font-size: 32px;
  margin-bottom: 30px;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 60px;
`;

const PlayBtn = styled.div`
  width: 150px;
  height: 50px;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.white.darker};
  cursor: pointer;
  svg {
    width: 30px;
    margin-right: 20px;
  }
  span {
    color: black;
    font-size: 25px;
  }
`;

const Overview = styled.div`
  font-size: 20px;
  display: grid;
  gap: 20px;
  grid-template-columns: 1.5fr 1fr;
`;

const OverviewCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const Misc = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${(props) => props.theme.white.darker};
  font-size: 15px;
  margin-bottom: 20px;
`;

const Disc = styled.div``;

interface IDetails {
  movieId: string;
}

function Details({ movieId }: IDetails) {
  const { data, isLoading } = useQuery<IMovieDetails>({
    queryKey: ["movies", movieId],
    queryFn: () => getMovieDetails(movieId),
  });
  console.log(data);
  return (
    <>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <DetailImg
            imgPath={getImg(
              data?.belongs_to_collection
                ? data.belongs_to_collection.backdrop_path
                : data?.backdrop_path || ""
            )}
          ></DetailImg>
          <DetailInfo>
            <Title>
              <h1>{data?.title}</h1>
            </Title>
            <Menu>
              <PlayBtn>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                  <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                </svg>
                <span>Play</span>
              </PlayBtn>
            </Menu>
            <Overview>
              <OverviewCol>
                <Misc>
                  <span>{data?.release_date.slice(0, 4)}</span>
                  <span>{data?.runtime} min</span>
                </Misc>
                <Disc>
                  <p>{data?.overview}</p>
                </Disc>
              </OverviewCol>
              <OverviewCol>
                <span style={{ fontSize: 15 }}>Genres: </span>
                <span style={{ fontSize: 18 }}>
                  {data?.genres.map((genre) => genre.name + ", ")}
                </span>
              </OverviewCol>
            </Overview>
          </DetailInfo>
        </>
      )}
    </>
  );
}

export default Details;
