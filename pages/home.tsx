import Layout from '../src/components/Layout';
import Timeline from '../src/components/timeline/timeline.component';

const IndexPage = () => (
  <Layout loggedIn={true}>
    <Timeline />
  </Layout>
);

export default IndexPage;
