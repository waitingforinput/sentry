"""
sentry.nodestore.django.backend
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:copyright: (c) 2010-2013 by the Sentry Team, see AUTHORS for more details.
:license: BSD, see LICENSE for more details.
"""

from __future__ import absolute_import

from django.utils import timezone

from sentry.db.models import create_or_update
from sentry.nodestore.base import NodeStorage

from .models import Node


class DjangoNodeStorage(NodeStorage):
    def get(self, id):
        try:
            return Node.objects.get(id=id).data
        except Node.DoesNotExist:
            return None

    def get_multi(self, id_list):
        return dict(
            (n.id, n.data)
            for n in Node.objects.filter(id__in=id_list)
        )

    def set(self, id, data, timestamp=None):
        create_or_update(
            Node,
            id=id,
            data=data,
            timestamp=timestamp or timezone.now()
        )

    def set_multi(self, values):
        for v in values:
            self.set(**v)
