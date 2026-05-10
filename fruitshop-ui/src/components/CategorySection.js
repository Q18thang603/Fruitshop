import { Link } from "react-router-dom";

import {
  GiFruitBowl,
  GiMeat,
  GiCabbage,
  GiEggClutch,
  GiMilkCarton
} from "react-icons/gi";

const categories = [
  {
    name: "Trái cây",
    value: "fruit"
  },
  {
    name: "Thịt",
    value: "meat"
  },
  {
    name: "Rau củ",
    value: "vegetable"
  },
  {
    name: "Bơ & Trứng",
    value: "organic"
  },
  {
    name: "Sữa & Kem",
    value: "dairy"
  },
];

const icons = [
  GiFruitBowl,
  GiMeat,
  GiCabbage,
  GiEggClutch,
  GiMilkCarton
];

export default function CategorySection() {

  return (
    <section className="category-area">

      <div className="container">

        <h2 className="category-heading">
          THỰC PHẨM HỮU CƠ
        </h2>

        <div className="category-section">

          {categories.map((item, index) => {

            const Icon = icons[index];

            return (

              <Link
                to={`/category/${item.value}`}
                key={item.value}
                className={`category-box ${index === 0 ? "active" : ""}`}
              >

                <span className="category-icon">
                  <Icon />
                </span>

                <span>
                  {item.name}
                </span>

              </Link>

            );
          })}

        </div>

      </div>

    </section>
  );
}
