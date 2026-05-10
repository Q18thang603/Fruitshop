import { Link } from "react-router-dom";

export default function Success() {

    return (
        <div className="success-page">

            <div className="success-box">

                <h1>
                    🎉 Đặt hàng thành công
                </h1>

                <p>
                    Cảm ơn bạn đã mua hàng
                    tại Organic Food
                </p>

                <Link to="/">

                    <button>
                        Quay về trang chủ
                    </button>

                </Link>

            </div>

        </div>
    );
}