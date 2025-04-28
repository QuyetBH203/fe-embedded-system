'use client';

import QueryProvider from './react-query';

export default function Providers({ children }: React.PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}
