export default function NotFound() {
  return (
    <div className="h-[601px] bg-red-white flex justify-center items-center">
      <div className="flex h-[160px] bg-[#570a86] p-8 flex-col rounded shadow-2xl items-center justify-center  text-neutral-300 gap-4">
        <img
          className="h-16 w-16"
          src="/assets/vivo-119.svg"
          style={{
            filter:
              "invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)",
          }}
        />
        <p className="text-[16px]">Página não encontrada.</p>
      </div>
    </div>
  );
}
