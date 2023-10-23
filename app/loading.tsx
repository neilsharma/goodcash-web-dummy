import Loader from "@/components/Loader";
import { Header } from "@/components/layout/Header";
import { Main } from "@/components/layout/Main";

export default function Loading() {
  return (
    <>
      <Header />
      <Main>
        <Loader />
      </Main>
    </>
  );
}
