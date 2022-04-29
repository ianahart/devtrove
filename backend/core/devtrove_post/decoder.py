import base64
import six
import uuid
import imghdr
import io

class Decoder():
    def __get_file_extension(self, file_name, decoded_file):
        extension = imghdr.what(file_name, decoded_file)
        extension = 'jpeg' if extension == 'jpeg' else extension
        return extension

    def decode_base64_file(self, data: str):
        if isinstance(data, six.string_types):
            if 'data:' in data and ';base64,' in data:
                header, data = data.split(';base64,')
            decoded_file = base64.b64decode(data)

            file_name = str(uuid.uuid4())[:12]
            file_extension = self.__get_file_extension(file_name, decoded_file)

            complete_file_name = "%s%s.%s" % ('posts/', file_name, file_extension, )
            return io.BytesIO(decoded_file), complete_file_name, file_extension


