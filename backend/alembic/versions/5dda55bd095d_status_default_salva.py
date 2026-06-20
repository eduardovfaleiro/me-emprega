"""status_default_salva

Revision ID: 5dda55bd095d
Revises: fa7ed9f6bb6e
Create Date: 2026-06-20 13:12:15.107714

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5dda55bd095d'
down_revision: Union[str, Sequence[str], None] = 'fa7ed9f6bb6e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("jobs", "status", server_default="salva")
    op.execute("UPDATE jobs SET status = 'salva' WHERE status = 'Aplicando'")


def downgrade() -> None:
    op.alter_column("jobs", "status", server_default="Aplicando")
    op.execute("UPDATE jobs SET status = 'Aplicando' WHERE status = 'salva'")
