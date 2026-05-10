import { Link } from "react-router-dom";

export default function Payment() {
    const paymentContent = encodeURIComponent(
        "MB Bank\nSTK: 123456789\nChu TK: ORGANIC FOOD"
    );

    const qrImage =
        `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${paymentContent}`;

    return (
        <div className="payment-page">

            <div className="payment-box">

                <h1>
                    Quét mã QR để thanh toán
                </h1>

                <img
                    src={qrImage}
                    alt=""
                />

                <p>
                    Ngân hàng MB Bank
                </p>

                <p>
                    STK: 123456789
                </p>

                <p>
                    Chủ TK: ORGANIC FOOD
                </p>

                <Link to="/success">

                    <button>
                        Tôi đã thanh toán
                    </button>

                </Link>

            </div>

        </div>
    );
}
