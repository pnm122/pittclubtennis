type FirebaseUtilityReturn<T> = Promise<
  | {
      success: true
      data: T
    }
  | {
      success: false
      data: {
        error: unknown
      }
    }
>
