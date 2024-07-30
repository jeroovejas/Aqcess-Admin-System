import Link from "next/link";
import Image from "next/image";

const chatData: any[] = [
  {
    avatar: "/images/user/user-01.png",
    name: "Devid Heilo",
    text: "How are you? Can you confirm if payment of this month has benn recieved",
    time: 12,
    address: '123 maple street',
    textCount: 3,
    dot: 3,
  },
  {
    avatar: "/images/user/user-02.png",
    name: "Henry Fisher",
    text: "Waiting for you!  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, labore?",
    time: 12,
    address: '123 maple street',
    textCount: 3,
    dot: 1,
  },
  {
    avatar: "/images/user/user-04.png",
    name: "Jhon Doe",
    text: "What's up?  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut, labore?",
    time: 32,
    address: '123 maple street',
    textCount: 6,
    dot: 3,
  },


];

const ChatCard = () => {
  return (
    <div className="col-span-12 rounded-2xl border border-[#DDDDDD] bg-white py-6 px-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className=" pb-4 text-xl  font-semibold text-black dark:text-white">
        Recent Messages
      </h4>

      <div>
        {chatData.map((chat, key) => (
          <Link
            href="/"
            className="  hover:bg-gray-3 dark:hover:bg-meta-4 "
            key={key}
          >
            <div className="flex items-center gap-5 px-4 py-3 border-t border-[#DDDDDD]">


              <div className="relative h-14 w-14 rounded-full">
                <Image
                  width={56}
                  height={56}
                  src={chat.avatar}
                  alt="User"
                  style={{
                    width: "auto",
                    height: "auto",
                  }}
                />
                <span
                  className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${chat.dot === 6 ? "bg-meta-6" : `bg-meta-${chat.dot}`
                    } `}
                ></span>
              </div>

              {/* <div className="flex flex-1 items-center justify-between"> */}
              <div className="flex justify-between w-[90%] lg:w-[80%]">
                <div>
                  <h5 className="font-medium text-black dark:text-white">
                    {chat.name}
                  </h5>
                  <span className="text-sm text-black dark:text-white">
                    {chat.address}
                  </span>
                </div>
                <div>
                  <p
                    className="text-xs ms-auto">  {chat.time} min
                  </p>
                </div>

              </div>
             

              {/* </div> */}
            </div>
            <div className="flex justify-between px-7.5 py-3">
              <p className="text-[14px]">{chat.text}</p>
              {chat.textCount !== 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                  <span className="text-sm font-medium text-white">
                    {" "}
                    {chat.textCount}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      <button className="text-black text-[14px] border border-[#DDDDDD] rounded-md px-2 py-1.5 font-bold mt-3">view messages</button>
    </div>
  );
};

export default ChatCard;
