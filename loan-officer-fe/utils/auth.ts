import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next"
import { parseCookies } from "nookies"

export function withAuth<P extends { [key: string]: any }>(
  getServerSideProps?: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>,
) {
  return async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context)
    const token = cookies.token

    if (!token) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      }
    }

    if (getServerSideProps) {
      return await getServerSideProps(context)
    }

    return {
      props: {} as P,
    }
  }
}
