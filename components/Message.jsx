const Message = ({ children, userName, description }) => {
  return (
    <div className="p-8 border-b-2 rounded-lg bg-slate-100 max-w-xl my-4 shadow-lg">
      <div>
        <h2>{userName}</h2>
      </div>
      <div>
        <p className="py-4">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default Message;
