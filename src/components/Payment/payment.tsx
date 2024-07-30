import Link from "next/link";
import Image from "next/image";

const paymentData: any[] = [
  {
    avatar: "/images/user/user-01.png",
    name: "Devid Heilo",
    amount: 500

  },
  {
    avatar: "/images/user/user-02.png",
    name: "Henry Fisher",
    amount: 400

  },
  {
    avatar: "/images/user/user-04.png",
    name: "Jhon Doe",
    amount: 300

  },
  {
    avatar: "/images/user/user-05.png",
    name: "Jane Doe",
    amount: 200

  },
  {
    avatar: "/images/user/user-01.png",
    name: "Jhon Doe",
    amount: 600

  },

];

const Payment = () => {
  return (
    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white pt-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
        Recent Payments
      </h4>
      <div className="flex bg-[#EDEEEF] border-y border-[#DDDDDD] justify-between px-5 py-3">
        <p className="text-[12px] font-[600]">Residents</p>
        <p className="text-[12px] font-[600]">Amount</p>
      </div>

      <div>
        {paymentData.map((paymnet, key) => (
          <Link
            href="/"
            className="flex border-t border-[#DDDDDD] items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                width={56}
                height={56}
                src={paymnet.avatar}
                alt="User"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {paymnet.name}
                </h5>
              </div>
              <span className="text-sm font-medium ">
                ${paymnet.amount}
              </span>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Payment;
