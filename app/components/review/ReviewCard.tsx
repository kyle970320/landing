import LogoImage from "../images/logo/D-SKET-LOGO.png";
import Image from "next/image";

interface Props {
  id: string;
  img: string;
  name: string;
  subTitle: string;
  content: string;
}
export default function ReviewCard(props: Props) {
  const { name, subTitle, content } = props;
  return (
    <div className="overflow-hidden border border-gray-200 rounded-xl hover:shadow-xl transition-all">
      <div className="flex gap-2 px-4 py-5">
        <Image
          src={LogoImage}
          alt="D-SKET Logo"
          className="w-10 h-10 rounded-[50%]"
          width={150}
          height={60}
          priority
        />
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-gray-400 text-sm">{subTitle}</p>
        </div>
      </div>
      <div className="bg-[#F5F5F5] px-4 py-5 text-[#999999] break-all">
        {content}
      </div>
    </div>
  );
}
