export const EachMessage = ({ message }: { message: string }) => {
  return (
    <div safe class="mx-2 my-4 border px-3 py-3" id="each_message">
      {message}
    </div>
  );
};
