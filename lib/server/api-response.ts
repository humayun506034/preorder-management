export type ApiResponsePayload<TData, TMeta = undefined> = {
  statusCode: number;
  message: string;
  data: TData;
  meta?: TMeta;
  success?: boolean;
};

export function apiResponse<TData, TMeta = undefined>({
  statusCode,
  message,
  data,
  meta,
  success = true,
}: ApiResponsePayload<TData, TMeta>) {
  return Response.json(
    {
      success,
      statusCode,
      message,
      data,
      ...(meta === undefined ? {} : { meta }),
    },
    { status: statusCode },
  );
}

export function errorResponse(message: string, statusCode = 400) {
  return apiResponse({
    success: false,
    statusCode,
    message,
    data: null,
  });
}
