import dynamic from 'next/dynamic';

export default function ChatPage() {
  return (
    <main>
      <InnerContent />
    </main>
  );
}

const InnerContent = dynamic(() => import('../components/ChatPageContent'), {
  ssr: false,
});
