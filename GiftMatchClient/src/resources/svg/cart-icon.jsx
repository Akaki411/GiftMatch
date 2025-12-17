import * as React from "react"

const CartIcon = ({
    size = 24,
    color = "#000000"
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        fill="none"
    >
        <g clipPath="url(#a)">
            <path
                fill={color}
                d="M22.562 3a1 1 0 0 1 0 2h-.858a.5.5 0 0 0-.48.361l-3.161 10.917a1 1 0 0 1-.96.722H5.28a1 1 0 0 1-.922-.613l-3.776-9A1 1 0 0 1 1.504 6h13.987a1 1 0 0 1 0 2H3.76a.5.5 0 0 0-.461.693l2.517 6a.5.5 0 0 0 .461.307h9.719a.5.5 0 0 0 .48-.363l3.122-10.912A1 1 0 0 1 20.559 3h2.003ZM8.5 18a1.5 1.5 0 1 0 .001 3.001A1.5 1.5 0 0 0 8.5 18Zm5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z"
            />
        </g>
        <defs>
            <clipPath id="a">
                <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
        </defs>
    </svg>
)
export default CartIcon