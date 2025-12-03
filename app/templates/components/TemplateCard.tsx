interface Props {
  title: string;
  desc: string;
  url: string;
  type: string;
}

export default function TemplateCard(props: Props) {
  const { title, desc, url } = props;
  return (
    <div className="group flex flex-col aspect-10/9 overflow-hidden bg-white rounded-md shadow-md transition-all hover:shadow-xl">
      <div className="overflow-hidden">
        <img
          className="w-full transition-all group-hover:scale-110"
          src={url}
          alt=""
          style={{
            aspectRatio: 1.7 / 1,
          }}
        />
      </div>
      <div className="flex-1 flex flex-col items-start justify-between p-4 font-noto">
        <p className="text-main-title font-bold">{title}</p>
        <p className="text-[#999999]">{desc}</p>
      </div>
    </div>
  );
}
