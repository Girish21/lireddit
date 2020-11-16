import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <NavBar />
      <div>
        {!data ? null : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
      </div>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
