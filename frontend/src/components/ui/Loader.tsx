// export default function Loader() {
//   return <span className="loading loading-spinner loading-md flex items-center justify-center">
//     Loading
//   </span>;
// }


export default function Loader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-base-100">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/60">Loading...</p>
      </div>
    </div>
  );
}