import type { GetServerSideProps } from 'next'

export default function ProcessoSeletivoAntigo() {
  return null
}

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: '/processo-seletivo-2027-1',
    permanent: true,
  },
})
