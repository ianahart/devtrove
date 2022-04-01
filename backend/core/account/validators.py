from rest_framework.exceptions import APIException
from rest_framework import status


class CustomValidator(APIException):
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = 'A server error occurred.'

    def __init__(self, detail, field, status_code):
        if status_code is not None:
            self.status_code = status_code

        if detail is not None:

            if '_' in field:
                f_field = self.format(field)
            else:
                f_field = self.capitalize(field)

            self.detail = {'errors': [
                {field: [
                    f'{f_field} {str(detail)}'
                ]
                }]}
        else:
            self.detail = {detail: self.default_detail}


    def format(self, field: str):
        f_field = ''
        for index, word in enumerate(field.split('_')):
            word = self.capitalize(word)
            f_field += word if len(field.split('_')) - 1 == index else f'{word} ' 

        return f_field

    def capitalize(self, chunk: str):
        if chunk:
            return chunk[0:1].upper() + chunk[1:].lower()
        return ''
