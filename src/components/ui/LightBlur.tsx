export function LightBlur() {
    return (
      <div className="-z-1 absolute w-full h-full">
        <div className="bg-red-500 absolute w-48 h-48 blur-3xl -top-5 -left-5 brightness-50" />
        <div className="bg-red-500 absolute w-72 h-48 blur-3xl bottom-5 right-5 brightness-50" />
      </div>
    );
  }