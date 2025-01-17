import Navbar from "../components/Navbar";
import { images } from "../constants";
import "../assets/css/home.css";
import AllProduct from "./AllProduct";
import Footer from "../components/Footer";

const HomePage = () => {
  return (
    <>
      <div className="app__bg-home">
        <Navbar />
        <div className="container app__round d-flex justify-content-center align-items-center min-vh-100">
          <div className="row align-items-center app__home-mobile">
            <div className="col-md-6 text-center text-md-start mb-4 mb-md-0 app__home-color">
              <h1 className="display-3 fw-bold">
                Harmony In
                <span className="mobile-break"> Every Drop,</span>
                <span className="mobile-break">Naturally Yours</span>
              </h1>

              <p className="fs-5">
                Experience the purity of skincare with our all-natural
                collection, thoughtfully created just for you. Unveil the beauty
                of wholesome ingredients working in harmony to nourish and
                revitalize your skin.
              </p>
              {/* <button className="btn text-dark px-4 fw-bolder py-2 mt-4">
                Shop Now
              </button> */}
              <a
                href="#products"
                className="btn text-dark px-4 fw-bolder py-2 mt-4"
              >
                Shop Now
              </a>
            </div>
            <div className="col-md-6">
              <div className="position-relative">
                <img
                  src={images.union}
                  alt="A collection of skincare products"
                  className="img-fluid rounded-lg mb-5"
                  width={500}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <AllProduct />
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
