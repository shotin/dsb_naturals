import Category from "../components/Category";
import Product from "../components/Product";
import { images } from "../constants";

const AllProduct = () => {
  return (
    <div>
      <div className="container my-5">
        <div className="row g-4">
          <div className="col-md-6">
            <Product
              title="Hatomugi Moisturizing And Brightening Shower Gel 800ml"
              sale="Sale up to 50%"
              buttonText="SHOP NOW"
              imageUrl={images.kooo}
            />
          </div>
          <div className="col-md-6">
            <Product
              title="Natural Plant Ingredients Lip Balm Labello"
              sale="Sale up to 20%"
              buttonText="SHOP NOW"
              imageUrl={images.kooo}
            />
          </div>
        </div>
      </div>

      <div style={{ background: "#CEDFC3" }} className="py-5" id="products">
        <Category />
      </div>
    </div>
  );
};

export default AllProduct;
