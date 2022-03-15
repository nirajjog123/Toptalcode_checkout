import styles from "./Checkout.module.css";
import { LoadingIcon } from "./Icons";
import { getProducts } from "./dataService";
import { useEffect, useState } from "react/cjs/react.development";

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places

const Product = ({
  id,
  name,
  availableCount,
  price,
  orderedQuantity,
  total,
  handleAdd,
  handleMinus,
  disableAdd,
  disableMinus,
}) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>
      <td>${total}</td>
      <td>
        <button
          className={styles.actionButton}
          onClick={(e, id) => {
            handleAdd(e, id);
          }}
          disabled={disableAdd}
        >
          +
        </button>
        <button
          className={styles.actionButton}
          onClick={(e, id) => {
            handleMinus(e, id);
          }}
          disabled={disableMinus}
        >
          -
        </button>
      </td>
    </tr>
  );
};

const Checkout = () => {
  const [data, setData] = useState([]);
  const [totalPrice, setTotal] = useState(0);
  const [discTotal, setDiscTotal] = useState(0);
  useEffect(() => {
    const tempData = getProducts();
    tempData.then((res) => {
      res.forEach((element) => {
        element.orderedQuantity = 0;
        element.total = 0;
      });
      console.log(res);
      setData(res);
    });
  }, []);

  const handleAdd = (e, item) => {
    const tempIndx = data.findIndex((dataId) => dataId.id === item.id);
    console.log("Index is" + tempIndx);
    let tempObj = [...data];
    // tempObj = data[tempIndx];
    tempObj[tempIndx].availableCount = tempObj[tempIndx].availableCount - 1;
    tempObj[tempIndx].orderedQuantity = tempObj[tempIndx].orderedQuantity + 1;
    tempObj[tempIndx].total =
      tempObj[tempIndx].price * tempObj[tempIndx].orderedQuantity;

    console.log(tempObj);
    setData(tempObj);
    calculateTotal(tempObj);
  };

  const handleMinus = (e, item) => {
    const tempIndx = data.findIndex((dataId) => dataId.id === item.id);
    let tempObj = [...data];
    // tempObj = data[tempIndx];
    tempObj[tempIndx].availableCount = tempObj[tempIndx].availableCount + 1;
    tempObj[tempIndx].orderedQuantity = tempObj[tempIndx].orderedQuantity - 1;
    tempObj[tempIndx].total = parseFloat(
      tempObj[tempIndx].price * tempObj[tempIndx].orderedQuantity
    ).toFixed(2);

    console.log(tempObj);
    setData(tempObj);
    calculateTotal(tempObj);
  };

  const calculateTotal = (tempObj) => {
    let totalPrice = 0;
    tempObj.forEach((elem) => {
      totalPrice = elem.total + totalPrice;
    });
    const finalAmount = calculateDiscout(totalPrice); // get the discouted value
    setTotal(parseFloat(finalAmount).toFixed(2));
  };

  const calculateDiscout = (total) => {
    if (total > 1000) {
      let discVal = total - total / 10;
      setDiscTotal(parseFloat(total / 10).toFixed(2));
      return discVal;
    } else {
      return total;
    }
  };

  return (
    <div>
      <header className={styles.header}>
        <h1>Electro World</h1>
      </header>
      <main>
        {data && data.length < 0 && <LoadingIcon />}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((item) => {
                return (
                  <Product
                    id={item.id}
                    name={item.name}
                    availableCount={item.availableCount}
                    price={item.price}
                    orderedQuantity={item.orderedQuantity}
                    total={item.total}
                    handleAdd={(e) => handleAdd(e, item)}
                    handleMinus={(e) => handleMinus(e, item)}
                    disableAdd = {item.availableCount===0}
                    disableMinus = {item.orderedQuantity===0}
                  />
                );
              })}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ {discTotal}</p>
        <p>Total: $ {totalPrice}</p>
      </main>
    </div>
  );
};

export default Checkout;
