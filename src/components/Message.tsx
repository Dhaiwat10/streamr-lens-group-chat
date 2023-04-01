import { useAccount } from 'wagmi';

interface IMessageProps {
  message: string;
  author?: string;
}

export const Message = ({ message, author }: IMessageProps) => {
  const { address } = useAccount();
  const isTheMessageFromMe = author === address;

  return (
    <div
      className={`shadow rounded p-2 w-fit bg-slate-200 ${
        isTheMessageFromMe ? 'ml-auto' : 'mr-auto'
      }`}
    >
      <p>{message}</p>
      <p>{author ?? ''}</p>
    </div>
  );
};
