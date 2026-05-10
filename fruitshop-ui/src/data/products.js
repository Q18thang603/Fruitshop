import { cloudinaryImage } from "../utils/cloudinary";

const fallbackImages = {
  apple: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=700&q=80",
  orange: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=700&q=80",
  broccoli: "https://images.unsplash.com/photo-1583663848850-46af132dc08e?auto=format&fit=crop&w=700&q=80",
  carrot: "https://images.unsplash.com/photo-1447175008436-054170c2e979?auto=format&fit=crop&w=700&q=80",
  cabbage: "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?auto=format&fit=crop&w=700&q=80",
  avocado: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80",
  banana: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=700&q=80",
  organicMilk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=700&q=80",
  organicEggs: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=80"
};

const cloudinaryProductIds = {
  orangeJuice: "01_wp9ooz",
  carrot: "03_t6efex",
  orange: "09_j2agcb",
  purpleCabbage: "02_borlta",
  organicChicken: "07_lzzekz",
  broccoli: "12_qjr34x",
  freshCarrot: "03_t6efex",
  cabbage: "11_dkyab8",
  avocado: "avocado_wrpwdg",
  banana: "banana_zhip9c",
  beef: "04_gdgi6n",
  organicMilk: "17_p92pid",
  organicEggs: "18_xmvgda"
};

const productImage = (publicId, fallbackKey) => {
  const fallbackImage = fallbackImages[fallbackKey];

  return {
    image: cloudinaryImage(publicId, fallbackImage),
    imageFallback: fallbackImage,
    cloudinaryPublicId: publicId
  };
};

export const products = [
  {
    id: 1,
    name: "Nước Cam Hữu Cơ",
    price: 240000,
    ...productImage(cloudinaryProductIds.orangeJuice, "orange"),
    category: "fruit",
    categoryLabel: "Trái cây & hạt",
    groupLabel: "Trái cây - rau quả",
    sku: "A0016",
    keywords: "Fresh, Organic",
    rating: 0,
    desc: "Nước cam hữu cơ được làm từ những trái cam chín mọng, canh tác theo hướng tự nhiên và hạn chế tối đa hóa chất. Sản phẩm có vị ngọt thanh, hương cam tươi dễ uống, phù hợp dùng trong bữa sáng hoặc sau khi vận động để bổ sung năng lượng."
  },
  {
    id: 2,
    name: "Cà Rốt Hữu Cơ",
    price: 560000,
    ...productImage(cloudinaryProductIds.carrot, "carrot"),
    category: "vegetable",
    categoryLabel: "Rau củ",
    groupLabel: "Rau tươi",
    sku: "A0017",
    keywords: "Carrot, Organic",
    rating: 0,
    desc: "Cà rốt hữu cơ có màu cam tự nhiên, vị ngọt nhẹ và độ giòn tốt. Sản phẩm thích hợp để ép nước, nấu súp, làm salad hoặc chế biến các món ăn gia đình giàu vitamin và chất xơ."
  },
  {
    id: 3,
    name: "Cam Hữu Cơ",
    price: 449000,
    oldPrice: 545000,
    sale: "-18%",
    ...productImage(cloudinaryProductIds.orange, "orange"),
    category: "fruit",
    categoryLabel: "Trái cây & hạt",
    groupLabel: "Trái cây - rau quả",
    sku: "A0018",
    keywords: "Orange, Organic",
    rating: 4,
    swatches: ["#75d64b", "#e6a128", "#e34c3f", "#f2e817"],
    desc: "Cam hữu cơ được tuyển chọn từ vườn đạt tiêu chuẩn sạch, tép cam mọng nước và có vị chua ngọt cân bằng. Đây là lựa chọn phù hợp để ăn trực tiếp, ép nước hoặc dùng trong thực đơn bổ sung vitamin C hằng ngày."
  },
  {
    id: 4,
    name: "Bắp cải tím hữu cơ",
    price: 54000,
    oldPrice: 67000,
    sale: "-19%",
    ...productImage(cloudinaryProductIds.purpleCabbage, "cabbage"),
    category: "vegetable",
    categoryLabel: "Rau củ",
    groupLabel: "Rau tươi",
    sku: "A0019",
    keywords: "Purple cabbage, Organic",
    rating: 0,
    swatches: ["#e6a128", "#812cf2", "#f2e817"],
    desc: "Bắp cải tím hữu cơ có màu tím tự nhiên, lá giòn và vị ngọt nhẹ. Sản phẩm phù hợp để làm salad, xào nhanh hoặc dùng trong các món ăn cần bổ sung chất xơ và màu sắc bắt mắt."
  },
  {
    id: 5,
    name: "Thịt Bò Hữu Cơ",
    price: 200000,
    oldPrice: 245000,
    sale: "-18%",
    ...productImage(cloudinaryProductIds.beef, "organicEggs"),
    category: "meat",
    categoryLabel: "Thịt",
    groupLabel: "Thịt hữu cơ",
    sku: "A0020",
    keywords: "Beef, Organic",
    rating: 4,
    desc: "Thịt bò hữu cơ được chọn lọc kỹ, thớ thịt săn chắc và giữ được vị ngọt tự nhiên. Sản phẩm phù hợp cho các món áp chảo, nướng, hầm hoặc chế biến bữa ăn giàu đạm cho gia đình."
  },
  {
    id: 6,
    name: "Bông cải xanh",
    price: 75000,
    ...productImage(cloudinaryProductIds.broccoli, "broccoli"),
    category: "vegetable",
    categoryLabel: "Rau củ",
    groupLabel: "Rau tươi",
    sku: "A0021",
    keywords: "Broccoli, Organic",
    rating: 5,
    desc: "Bông cải xanh tươi có màu xanh đậm, búp chắc và giữ được độ giòn sau khi chế biến. Sản phẩm giàu chất xơ, vitamin và khoáng chất, phù hợp cho bữa ăn cân bằng."
  },
  {
    id: 7,
    name: "Cà rốt sạch",
    price: 55000,
    ...productImage(cloudinaryProductIds.freshCarrot, "carrot"),
    category: "vegetable",
    categoryLabel: "Rau củ",
    groupLabel: "Rau tươi",
    sku: "A0022",
    keywords: "Carrot, Fresh",
    rating: 4,
    desc: "Cà rốt sạch được sơ tuyển kỹ, củ đều, tươi và dễ chế biến. Bạn có thể dùng để nấu canh, hầm, xào hoặc ép cùng trái cây để tạo thức uống lành mạnh."
  },
  {
    id: 8,
    name: "Bắp cải hữu cơ",
    price: 60000,
    ...productImage(cloudinaryProductIds.cabbage, "cabbage"),
    category: "vegetable",
    categoryLabel: "Rau củ",
    groupLabel: "Rau tươi",
    sku: "A0023",
    keywords: "Cabbage, Organic",
    rating: 4,
    desc: "Bắp cải hữu cơ có lá cuộn chắc, vị ngọt nhẹ và dễ kết hợp trong nhiều món ăn. Sản phẩm thích hợp làm salad, luộc, xào hoặc nấu canh."
  },
  {
    id: 9,
    name: "Bơ Hữu Cơ",
    price: 95000,
    oldPrice: 134000,
    sale: "-29%",
    ...productImage(cloudinaryProductIds.avocado, "avocado"),
    category: "organic",
    categoryLabel: "Bơ & Trứng",
    groupLabel: "Thực phẩm hữu cơ",
    sku: "A0024",
    keywords: "Avocado, Organic",
    rating: 5,
    desc: "Bơ hữu cơ có phần thịt dẻo béo, màu vàng đẹp và hương thơm tự nhiên. Sản phẩm phù hợp để làm sinh tố, salad hoặc ăn cùng bánh mì trong bữa sáng."
  },
  {
    id: 10,
    name: "Sữa organic",
    price: 145000,
    ...productImage(cloudinaryProductIds.organicMilk, "organicMilk"),
    category: "dairy",
    categoryLabel: "Sữa & Kem",
    groupLabel: "Sản phẩm từ sữa",
    sku: "A0025",
    keywords: "Milk, Organic",
    rating: 4,
    desc: "Sữa organic có vị thơm béo nhẹ, được sản xuất theo quy trình kiểm soát nghiêm ngặt. Sản phẩm thích hợp uống trực tiếp, dùng cùng ngũ cốc hoặc pha chế đồ uống."
  },
  {
    id: 11,
    name: "Trứng organic",
    price: 90000,
    ...productImage(cloudinaryProductIds.organicEggs, "organicEggs"),
    category: "organic",
    categoryLabel: "Bơ & Trứng",
    groupLabel: "Thực phẩm hữu cơ",
    sku: "A0026",
    keywords: "Eggs, Organic",
    rating: 4,
    desc: "Trứng organic có lòng đỏ đẹp, vị béo tự nhiên và nguồn gốc rõ ràng. Đây là nguyên liệu tiện lợi cho bữa sáng, món bánh hoặc các món ăn giàu đạm."
  },
  {
    id: 12,
    name: "Chuối Hữu Cơ",
    price: 199000,
    oldPrice: 239000,
    sale: "-17%",
    ...productImage(cloudinaryProductIds.banana, "banana"),
    category: "fruit",
    categoryLabel: "Trái cây & hạt",
    groupLabel: "Trái cây - rau quả",
    sku: "A0027",
    keywords: "Banana, Organic",
    rating: 5,
    desc: "Chuối hữu cơ có vị ngọt tự nhiên, mềm thơm và tiện dùng cho bữa sáng hoặc bữa phụ. Sản phẩm phù hợp ăn trực tiếp, làm sinh tố hoặc kết hợp cùng ngũ cốc."
  }
];
