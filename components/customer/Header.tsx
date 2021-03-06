import {
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Divider,
} from "@chakra-ui/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useToken } from "../../Context/TokenProvider";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useUser } from "../../Context/UserProvider";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { cartItems } from "../../redux/features/cart/fetchCart";

interface DefaultRootState {
  cart: any;
}
export const Header = () => {
  const { cartLength } = useSelector<DefaultRootState, any>(
    (state) => state.cart
  );
  const dispatch = useDispatch();

  const { Token } = useToken();
  const router = useRouter();
  const role = Cookies && Cookies.get("role");
  const { User } = useUser();
  const [IsOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(cartItems(Token));
  }, [Token, cartLength]);

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim() !== "") {
      router.push(`/search?query=${search}`);
    }
  }

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to LogOut?")) {
      const instance = axios.create({
        withCredentials: true,
      });

      try {
        const res = await instance.post(`http://localhost:4000/api/logout`);
        if (res.data) {
          router.reload();
          return;
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div>
      <div className="header-component">
        <header>
          <div className="header-wrap">
            <div className="header-wrap_left">
              <button
                className="hamburger"
                onClick={() => {
                  setIsOpen(!IsOpen);
                }}
              >
                <img src="/menu.svg" alt="menu" />
              </button>
              <div className="logo">
                <Link href="/">
                  <a>PartyStore</a>
                </Link>
              </div>
            </div>

            {/* SEARCH BAR FOR DESKTOP */}

            <div className="large-bar">
              <form onSubmit={handleSearch}>
                <InputGroup size="md">
                  <InputLeftAddon
                    onClick={handleSearch}
                    cursor="pointer"
                    children={<Icon name="search" color="blue.800" />}
                    borderTop="none"
                    color="blue.400"
                  />
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search"
                    placeholder="Search our 1000+ products"
                  />
                </InputGroup>
              </form>
            </div>

            <div className="header-wrap_right">
              <div>
                <Popover usePortal>
                  <PopoverTrigger>
                    <Button
                      size="sm"
                      style={{ color: "white", background: "var(--deepblue)" }}
                      rightIcon="chevron-down"
                    >
                      {Token && role ? (
                        <div
                          className="profile-icon"
                          style={{ cursor: "pointer" }}
                        >
                          <div>Hi, {Token && User && User.first_name}</div>
                        </div>
                      ) : (
                        <div>Login</div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent width="30" zIndex={999}>
                    <div className="pop-over-body">
                      {!Token && !role && (
                        <p
                          style={{
                            color: "var(--deepblue)",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <Link href="/customer/login">
                            <a>LOGIN</a>
                          </Link>
                        </p>
                      )}
                      {!Token && !role && (
                        <p
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Or
                        </p>
                      )}
                      {!Token && !role && (
                        <p
                          style={{
                            color: "var(--deepblue)",
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          <Link href="/customer/register">
                            <a>CREATE AN ACCOUNT</a>
                          </Link>
                        </p>
                      )}
                      {!Token && !role && <Divider />}
                      <div className="pop-over-body-rest">
                        {Token && role === "vendor" && (
                          <p>
                            <Link href="/vendor/dashboard">
                              <a>Dashboard</a>
                            </Link>
                          </p>
                        )}
                        <p>
                          <Link href="/customer/account">
                            <a>Account</a>
                          </Link>
                        </p>
                        <p>
                          <Link href="/customer/cart">
                            <a>Cart</a>
                          </Link>
                        </p>
                        <p>
                          <Link href="/customer/orders">
                            <a>Orders</a>
                          </Link>
                        </p>
                        <p>Help</p>
                        {Token && role && (
                          <Button
                            variantColor="blue"
                            width="100%"
                            display="block"
                            marginTop="5px"
                            onClick={handleLogout}
                          >
                            Logout
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="cart-icon">
                <Link href="/customer/cart">
                  <a>
                    <aside>{cartLength === 0 ? null : cartLength}</aside>
                    <img src="/shopping-cart.svg" alt="cart-icon" />
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* MOBILE SEARCH BAR dont show in these routes  */}

        {router.pathname !== "/customer/login" &&
          router.pathname !== "/customer/register" && (
            <div className="search-bar">
              <form onSubmit={handleSearch}>
                <InputGroup size="md">
                  <InputLeftAddon
                    onClick={handleSearch}
                    cursor="pointer"
                    children={<Icon name="search" color="blue.800" />}
                    borderTop="none"
                    color="blue.400"
                  />
                  <Input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    id="search mobile"
                    placeholder="Search our 1000+ products"
                  />
                </InputGroup>
              </form>
            </div>
          )}
      </div>

      {/* MENU SECTION */}

      <section className={IsOpen ? "navigation open-nav" : "navigation"}>
        <nav>
          <div
            className="nav-profile"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {Token && role ? (
              <div style={{ cursor: "pointer" }}>
                <div>Hi, {Token && User && User.first_name}</div>
              </div>
            ) : (
              <Link href="/customer/login">
                <a>Hello, Login</a>
              </Link>
            )}

            <button
              aria-roledescription="close menu"
              onClick={() => {
                setIsOpen(!IsOpen);
              }}
            >
              <Icon name="close" color="white" />
            </button>
          </div>
          <h1>PROFILE</h1>
          <ul>
            <li>
              <Link href="/customer/account">
                <a>Account</a>
              </Link>
            </li>
            <li>
              <Link href="/customer/cart">
                <a>Cart</a>
              </Link>
            </li>
            <li>
              <Link href="/customer/orders">
                <a>Orders</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Help</a>
              </Link>
            </li>
            <li>
              <Link href="/stores">
                <a>Stores</a>
              </Link>
            </li>
          </ul>
          <h1>SHOP BY CATEGORY</h1>
          <ul>
            <li>
              <Link href="/category?category=Gifts">
                <a>Gifts</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Decorations">
                <a>Decorations</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Games">
                <a>Games</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Drinks">
                <a>Drinks</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Props">
                <a>Party Props</a>
              </Link>
            </li>
            <li>
              <Link href="/category?category=Cakes">
                <a>Cakes</a>
              </Link>
            </li>
          </ul>

          <h1>SHOP BY PARTY</h1>
          <ul>
            <li>
              <Link href="/party?category=House Party">
                <a>House Party</a>
              </Link>
            </li>
            <li>
              <Link href="/party?category=Beach Party">
                <a>Beach Party</a>
              </Link>
            </li>
            <li>
              <Link href="/party?category=Games">
                <a>Games</a>
              </Link>
            </li>
            <li>
              <Link href="/party?category=Birthday Party">
                <a>Birthdays</a>
              </Link>
            </li>
            <li>
              <Link href="/party?category=Outdoors">
                <a>Outdoors</a>
              </Link>
            </li>
            <li>
              <Link href="/party?category=Indoors">
                <a>Indoors</a>
              </Link>
            </li>
          </ul>
        </nav>
      </section>

      <style jsx>{`
        header {
          box-shadow: var(--box) var(--softgrey);
          padding: 5px 0;
        }
        .header-component {
          position: sticky;
          position: -webkit-sticky;
          top: 0;
          background: white;
        }
        .header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: auto;
          width: 90%;
        }
        .header-wrap img {
          width: 40px;
          height: 35px;
        }
        .header-wrap_left,
        .header-wrap_right {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          color: var(--deepblue);
          margin-left: 10px;
          font-weight: bold;
          font-size: 1.2rem;
          font-style: italic;
        }

        .cart-icon {
          color: var(--deepblue);
          margin-left: 10px;
          font-size: 0.8rem;
          text-align: center;
          font-weight: bold;
          position: relative;
        }
        .cart-icon img {
          width: 30px;
          height: 25px;
        }
        .cart-icon a aside {
          position: absolute;
          top: 0;
          margin-left: 20px;
          margin-top: -12px;
          color: var(--deepblue);
          font-weight: bolder;
        }

        .large-bar {
          display: none;
        }

        /* Navigation and Hamburger  */

        .navigation {
          background: var(--softblue);
          width: 80%;
          height: 100%;
          margin-left: -85%;
          position: relative;
          position: fixed;
          top: 0;
          bottom: 0;
          z-index: 9999;
          transition: 0.5s ease;
          overflow-y: scroll;
        }

        .navigation.open-nav {
          margin-left: 0%;
          transition: ease 0.4s;
        }
        .navigation nav ul li {
          padding: 10px;
          border-bottom: 1px solid var(--lightblue);
        }

        .navigation nav ul li {
          z-index: 9999;
        }
        .navigation h1 {
          color: $text;
          font-weight: bold;
          padding: 8px;
          text-align: center;
        }

        .nav-profile {
          background: var(--deepblue);
          color: white;
          padding: 10px;
          font-weight: bold;
          font-style: italic;
        }

        .pop-over-body {
          padding: 0 2px;
        }
        .pop-over-body-rest {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .pop-over-body-rest p {
          font-weight: bold;
          padding: 8px 0;
          text-align: center;
          font-style: italic;
        }

        @media only screen and (min-width: 700px) {
          .header-wrap {
            justify-content: space-around;
          }
          .large-bar {
            display: block;
          }
          .large-bar {
            width: 60%;
          }
          .search-bar {
            display: none;
          }

          .navigation {
            width: 50%;
          }
          .cart-icon {
            font-size: 1rem;
          }

          .cart-icon img {
            width: 35px;
            height: 30px;
          }
        }

        @media only screen and (min-width: 1000px) {
          .navigation {
            width: 30%;
          }

          .pop-over-body-rest p {
            padding: 0 20px;
          }
        }

        @media only screen and (min-width: 1200px) {
          .navigation ul li {
            font-size: 1.1rem;
          }
        }
        @media only screen and (min-width: 1400px) {
          .navigation ul li {
            font-size: 1.2rem;
          }
        }
        @media only screen and (min-width: 1800px) {
          .navigation ul li {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  );
};
