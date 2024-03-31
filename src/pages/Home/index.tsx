import { useEffect, useRef, useState } from "react";
import snowBackground from "../../assets/snow.jpg";
import { GoPaperAirplane } from "react-icons/go";
import { socket } from "../../socket";
import { FaCheck } from "react-icons/fa";

type Messages = {
  text: string;
  isOwner: boolean;
  name: string;
};

const Home = () => {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [socketInstance] = useState(socket());
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketInstance.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socketInstance.off("message");
    };
  }, []);

  function handleSetUser() {
    setUsername(inputName);
    setInputName("");
  }

  function handleSubmit() {
    if (username.trim() === "") {
      alert("Você só pode mandar mensagem se tiver um username");
      return;
    }

    if (!inputMessage) {
      alert("Você deve digitar uma mensagem");
      return;
    }

    const newMessage = { text: inputMessage, name: username };

    socketInstance.emit("message", newMessage);
    setMessages((prev) => [...prev, { ...newMessage, isOwner: true }]);
    setInputMessage(""); // Limpa o input após o envio da mensagem
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSubmit();
      scrollToBottom();
    }
  }

  function scrollToBottom() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section
      className="min-h-screen w-full bg-cover bg-repeat bg-center flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${snowBackground})` }}
    >
      <div className="mb-5 flex items-center justify-center">
        <input
          className=" w-[250px]  md:w-[400px] px-2 outline-none h-10 rounded-l-lg"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          type="text"
          placeholder="Escolha um username"
        />
        <button
          onClick={handleSetUser}
          className="bg-blue-500 rounded-r-lg h-10 px-2"
        >
          <FaCheck className="text-white" />
        </button>
      </div>

      <div className=" w-[300px] h-[300px]  md:w-[450px] md:h-[400px] overflow-auto bg-transparent rounded-t-xl backdrop-blur-md">
        <div className="p-4 min-h-full w-full">
          {messages.map((message, index) => (
            <div key={index} className="min-h-full ">
              <p className="text-black font-bold px-1">
                {message.isOwner ? "" : message.name}
              </p>
              <p
                className={`mb-2 h-auto w-auto break-words whitespace-pre-wrap overflow-hidden text-wrap  p-3 rounded-lg px-5 ${
                  message.isOwner
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                } ${message.isOwner ? "" : ""}`}
              >
                {message.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-center items-center">
          <input
            value={inputMessage}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInputMessage(e.target.value)}
            type="text"
            className=" w-[250px] md:w-[400px] px-4 outline-none py-2"
            placeholder="Digite sua mensagem..."
          />
          <GoPaperAirplane
            onClick={handleSubmit}
            className=" text-blue-500 w-12 h-10 px-2.5 cursor-pointer bg-white"
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
