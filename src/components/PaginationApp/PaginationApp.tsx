import { Pagination } from '@mui/material'

type PaginationAppProps = {
  count: number
  onChange: (page: number) => void
  page: number
}

export function PaginationApp({ count, onChange, page }: PaginationAppProps) {
  return (
    <Pagination
      color="primary"
      count={count}
      onChange={(_, value) => onChange(value)}
      page={page}
      shape="rounded"
      size="small"
      variant="outlined"
    />
  )
}
