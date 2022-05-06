from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.core.paginator import Paginator
from django.db import models, DataError, DatabaseError
from django.utils import timezone
from account.models import CustomUser
from group.models import Group
from datetime import datetime, timedelta, date
import logging
logger = logging.getLogger('django')

class InvitationManager(models.Manager):




    def update(self, data: dict, id: int):
        try:
            invitation = Invitation.objects.get(pk=id)

            if invitation is None:
                raise ObjectDoesNotExist('Unable to find invitation to update.')

            invitation.accepted = data['accepted']
            invitation.save()

        except (DatabaseError, ObjectDoesNotExist) as e:
            if isinstance(e, ObjectDoesNotExist):
                logger.error(str(e))
            else:
                logger.error('Unable to update an invitation to accepted')


    def invitations(self, user_id: int, page: int):
        try:
            results = Invitation.objects.all().select_related(
                'host'
            ).order_by(
                '-id').filter(
                user_id=user_id
            ).filter(
                accepted=False
            )

            for result in results:
                result.avatar_url = result.host.avatar_url
                result.handle = result.host.handle
                result.title = result.group.title
            paginator = Paginator(results, 3)
            page = page + 1
            cur_page = paginator.page(page)

            objects = cur_page.object_list

            pagination = {'page': page, 'has_next': cur_page.has_next()}
            return objects, pagination

        except DatabaseError:
            logger.error('Unable to retrieve a user\'s invites.')
            return [], []

    def create(self, data):
        try:
           user= CustomUser.objects.all().filter(
                handle__iexact=data['handle']
            ).first()

           if user is None:
                raise ObjectDoesNotExist(
                    'A user with that handle does not exist.'
                )

           if user.id == data['host'].id:
                raise BadRequest(
                    'You cannot invite your self to a group that you are the host of.'
                )

           invitation_count = Invitation.objects.all().filter(
                user_id=user.id).filter(
                group_id=data['group'].id
            ).filter(
                accepted=False
            ).count()

           group_count = Group.objects.all().filter(
                group_user=user.id
            ).filter(
                host=data['host'].id
            ).count()

           if invitation_count > 0 or group_count > 0:
               handle = data['handle']
               raise BadRequest(f'You have already sent an invitation to {handle}')

           invitation = self.model(
                accepted=False,
                user_id=user.id,
                group=data['group'],
                host=data['host'],
            )
           invitation.save()
           return {}
        except (BadRequest, DatabaseError, ObjectDoesNotExist) as e:
            logger.error('Unable to send an invitation for a reading group.')
            return {'type': type(e), 'error': str(e)}



class Invitation(models.Model):

    objects:InvitationManager = InvitationManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    accepted = models.BooleanField(default=False, blank=True, null=True)
    group = models.ForeignKey(
        'group.Group',
        on_delete=models.CASCADE,
        related_name='invitation_group'
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='invitation_user'
    )

    host = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='invitation_host'
    )


    def __str__(self):
        return str(self.pk)
