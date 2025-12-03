export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] font-sans overflow-x-hidden">
      <div className="mt-40 page-container flex flex-wrap items-center">
        <div className="w-1/3 aspect-10/9 overflow-hidden rounded-2xl">
          <img className="w-full" src="/active-web.png" alt="" />
          <div>매거진 template</div>
        </div>
        <div className="w-1/3 p-4">
          <img
            className="w-full aspect-square rounded-2xl"
            src="/active-web.png"
            alt=""
          />
          <div>매거진 template</div>
        </div>
        <div className="w-1/3 p-4">
          <img
            className="w-full aspect-square rounded-2xl"
            src="/active-web.png"
            alt=""
          />
          <div>매거진 template</div>
        </div>
      </div>
    </div>
  );
}
