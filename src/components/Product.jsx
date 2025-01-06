import PropTypes from "prop-types";
const Product = ({ title, sale, buttonText, imageUrl }) => {
  return (
    <div className="p-4 rounded d-flex justify-content-between align-items-center shadow-lg">
      <div>
        <h2 className="h5 font-weight-bold mb-2">{title}</h2>
        <p className="h3 font-weight-bold text-dark mb-4">{sale}</p>
        <a
          href="#products"
          style={{ background: "#cedfc3" }}
          className="btn text-dark fw-bolder py-2 px-4 rounded"
        >
          {buttonText}
        </a>
      </div>
      <img
        src={imageUrl}
        alt="Product"
        className="img-fluid"
        width={200}
        height={200}
      />
    </div>
  );
};

Product.propTypes = {
  title: PropTypes.string.isRequired,
  sale: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};
export default Product;
