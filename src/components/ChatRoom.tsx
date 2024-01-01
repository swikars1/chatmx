import { EachMessage } from ".";

export const ChatRoom = ({ messages }: { messages: string[] }) => {
  return (
    <div hx-ext="ws" ws-connect="/ws/chatroom">
      <h1 class="text-large">hello! Its chat mx</h1>
      <div id="chat_container">
        <h2>Chats will appear here...</h2>
        {messages?.length > 0 &&
          messages.map((each_msg) => <EachMessage message={each_msg} />)}
      </div>
      <form
        // hx-target="#chat_container"
        // hx-swap="beforeend"
        ws-send
        _="on submit target.reset()"
      >
        <input
          class="border px-2 py-1 w-100"
          id="input_message"
          type="text"
          name="chatInput"
          placeholder="write message.."
        />

        <button class="px-3 py-1 rounded border" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};
