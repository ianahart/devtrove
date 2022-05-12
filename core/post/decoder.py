import base64
from types import NoneType
from django.core.exceptions import BadRequest
import six
import uuid
import imghdr
import io

class Decoder():
    def __get_file_extension(self, file_name, decoded_file):
        extension = imghdr.what(file_name, decoded_file)
        extension = 'jpeg' if extension == 'jpeg' else extension
        return extension



    def __file_size_exceeded(self, bytes: bytes):
        try:
            return True if len(bytes) > 1200000 else False
        except (Exception, ValueError, ):
            return False

    def decode_base64_file(self, data):
        try:
            if data is None:
                return
            if isinstance(data, six.string_types):
                if 'data:' in data and ';base64,' in data:
                    header, data = data.split(';base64,')
                decoded_file = base64.b64decode(data)
                file_size_limit = self.__file_size_exceeded(decoded_file)
                if file_size_limit:
                    raise ValueError('Image sizes must be under 1.2MB.');


                file_name = str(uuid.uuid4())[:12]
                file_extension = self.__get_file_extension(file_name, decoded_file)

                complete_file_name = "%s%s.%s" % ('posts/', file_name, file_extension, )
                return io.BytesIO(decoded_file), complete_file_name, file_extension
        except ValueError:
                    return None, None, None

