import styled from "styled-components";
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link, useRouteMatch } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Nav = styled(motion.nav)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  position: fixed;
  width: 100%;
`;

const Logo = styled(motion.svg)`
  width: 100px;
  height: 40px;
  margin: 0 50px;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled(motion.li)`
  margin-right: 20px;
  position: relative;
`;

const Circle = styled(motion.span)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: red;
  position: absolute;
  top: 20px;
  right: 0;
  left: 0;
  margin: 0 auto;
`;

const SearchBar = styled(motion.div)`
  width: 250px;
  position: relative;
  display: flex;
  align-items: center;
  padding: 3px;
  transform-origin: right center;
`;

const MagGlass = styled(motion.svg)`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  z-index: 1;
`;
const SearchInput = styled(motion.input).attrs({ as: motion.input })`
  transform-origin: right center;
  width: 250px;
  height: 35px;
  position: absolute;
  right: 5px;
  border-radius: 5px;
  padding-left: 35px;
  background-color: ${(props) => props.theme.black.veryDark};
  caret-color: white;
`;

const logoVar = {
  initial: {
    fillOpacity: 1,
  },
  hover: {
    fillOpacity: [1, 0, 1],
    transition: {
      repeat: Infinity,
      duration: 1,
    },
  },
};

function Header() {
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const [search, setSearch] = useState(false);
  const inputAnimation = useAnimation();
  const magGlassAnimation = useAnimation();
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleSearch = () => {
    if (search === true) {
      magGlassAnimation.start({
        x: 200,
      });
      inputAnimation.start({
        scaleX: 0,
        border: "none",
      });
    } else {
      magGlassAnimation.start({
        x: 0,
      });
      inputAnimation.start({
        scaleX: 1,
        border: "2px solid white",
      });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    setSearch((prev) => !prev);
  };
  console.log(search);
  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0,0,0,0)", "rgba(0,0,0,1)"]
  );
  return (
    <Nav style={{ backgroundColor: navBg }}>
      <Col>
        <Link to="/">
          <Logo
            variants={logoVar}
            initial="initial"
            whileHover="hover"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
            stroke="red"
            strokeWidth="2"
            transition={{}}
          >
            <motion.path
              d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z"
              fill="#d81f26"
            />
          </Logo>
        </Link>
        <Items>
          <Link to="/">
            <Item>
              Home
              {homeMatch?.isExact && <Circle layoutId="circle" />}
            </Item>
          </Link>
          <Link to="/tv">
            <Item>
              Tv Shows
              {tvMatch && <Circle layoutId="circle" />}
            </Item>
          </Link>
        </Items>
      </Col>
      <Col>
        <AnimatePresence>
          <SearchBar>
            <MagGlass
              fill="white"
              initial={{ x: 200 }}
              onClick={toggleSearch}
              animate={magGlassAnimation}
              transition={{ type: "tween" }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
            </MagGlass>
            <SearchInput
              ref={inputRef}
              initial={{ scaleX: 0, border: "none" }}
              animate={inputAnimation}
              transition={{ type: "tween" }}
              placeholder="title, person, genre"
            />
          </SearchBar>
        </AnimatePresence>
      </Col>
    </Nav>
  );
}

export default Header;
