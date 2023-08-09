interface Return {
  error?: any
  data?: any
}

const queryWithErrors = async <T, S>(callback: () => Promise<T>) => {
  try {
    const data = await callback()
    return { data }
  } catch(error) {
    return { error: error as S }
  }
}

export default queryWithErrors