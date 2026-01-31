export default function Loading() {
  return (
    <div className="relative w-full h-full">
      {/* Loader */}
      <div className="absolute top-1/2 left-1/2 -ml-[50px] -translate-y-1/2 animate-speeder">
        <span className="absolute -top-[19px] left-[60px] h-[5px] w-[35px] bg-black rounded-[2px_10px_1px_0]">
          <span className="absolute top-0 left-0 w-[30px] h-[1px] bg-black animate-fazer1"></span>
          <span className="absolute top-[3px] left-0 w-[30px] h-[1px] bg-black animate-fazer2"></span>
          <span className="absolute top-[1px] left-0 w-[30px] h-[1px] bg-black animate-fazer3" style={{ animationDelay: '-1s' }}></span>
          <span className="absolute top-[4px] left-0 w-[30px] h-[1px] bg-black animate-fazer4" style={{ animationDelay: '-1s' }}></span>
        </span>
        <div className="relative">
          <span className="absolute w-0 h-0 border-t-[6px] border-t-transparent border-r-[100px] border-r-black border-b-[6px] border-b-transparent before:content-[''] before:absolute before:h-[22px] before:w-[22px] before:rounded-full before:bg-black before:-right-[110px] before:-top-4 after:content-[''] after:absolute after:w-0 after:h-0 after:border-t-0 after:border-t-transparent after:border-r-[55px] after:border-r-black after:border-b-[16px] after:border-b-transparent after:-top-4 after:-right-[98px]"></span>
          <div className="absolute h-3 w-5 bg-black rounded-t-[20px] -rotate-[40deg] -right-[125px] -top-[15px] after:content-[''] after:absolute after:h-3 after:w-3 after:bg-black after:right-1 after:top-[7px] after:rotate-[40deg] after:origin-[50%_50%] after:rounded-bl-[2px]"></div>
        </div>
      </div>
      
      {/* Longfazers */}
      <div className="absolute w-full h-full">
        <span className="absolute top-[20%] h-[2px] w-[20%] bg-black animate-lf" style={{ animationDelay: '-5s' }}></span>
        <span className="absolute top-[40%] h-[2px] w-[20%] bg-black animate-lf2" style={{ animationDelay: '-1s' }}></span>
        <span className="absolute top-[60%] h-[2px] w-[20%] bg-black animate-lf3"></span>
        <span className="absolute top-[80%] h-[2px] w-[20%] bg-black animate-lf4" style={{ animationDelay: '-3s' }}></span>
      </div>
    </div>
  );
}
