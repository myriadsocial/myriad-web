import Layout from '../src/components/Layout';

import ConversationComponent from '../src/components/conversation/conversation.component';

const ConversationPage = () => (
  <Layout loggedIn={true}>
    <ConversationComponent />
  </Layout>
);

export default ConversationPage;
