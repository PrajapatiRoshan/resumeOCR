class APIException(Exception):
    def __init__(self, detail: str, status_code: int):
        self.detail = detail
        self.status_code = status_code

    def __str__(self):
        return f"{self.detail} (Status Code: {self.status_code})"
