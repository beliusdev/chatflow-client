import Header from './Header';
import ChatsSidebar from './ChatsSidebar';

import Message from './Message';

export default function Layout({ children }) {
  return (
    <div className="container">
      <Header />
      <main className="container container__main">
        <ChatsSidebar />
        {children}
        <Message />
      </main>
    </div>
  );
}
