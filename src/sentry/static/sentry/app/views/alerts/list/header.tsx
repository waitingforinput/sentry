import React from 'react';
import styled from '@emotion/styled';
import {InjectedRouter} from 'react-router/lib/Router';

import {IconSettings} from 'app/icons';
import {Organization} from 'app/types';
import {navigateTo} from 'app/actionCreators/navigation';
import {t} from 'app/locale';
import Feature from 'app/components/acl/feature';
import FeatureBadge from 'app/components/featureBadge';
import Button from 'app/components/button';
import ButtonBar from 'app/components/buttonBar';
import NavTabs from 'app/components/navTabs';
import * as Layout from 'app/components/layouts/thirds';
import space from 'app/styles/space';
import Link from 'app/components/links/link';

import CreateRuleButton from './createRuleButton';

type Props = {
  router: InjectedRouter;
  organization: Organization;
  activeTab: 'stream' | 'rules';
};

const AlertHeader = ({router, organization, activeTab}: Props) => {
  /**
   * Incidents list is currently at the organization level, but the link needs to
   * go down to a specific project scope.
   */
  const handleNavigateToSettings = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(`/settings/${organization.slug}/projects/:projectId/alerts/`, router);
  };

  return (
    <Layout.Header>
      <StyledLayoutHeaderContent>
        <StyledLayoutTitle>
          {t('Alerts')}{' '}
          <FeatureBadge
            title={
              activeTab === 'stream'
                ? t('This page is in beta and currently only shows metric alerts.')
                : undefined
            }
            type="beta"
          />
        </StyledLayoutTitle>
        <StyledNavTabs underlined>
          <Feature features={['incidents']} organization={organization}>
            <li className={activeTab === 'stream' ? 'active' : ''}>
              <Link to={`/organizations/${organization.slug}/alerts/`}>
                {t('Stream')}
              </Link>
            </li>
          </Feature>
          <li className={activeTab === 'rules' ? 'active' : ''}>
            <Link to={`/organizations/${organization.slug}/alerts/rules/`}>
              {t('Rules')}
            </Link>
          </li>
        </StyledNavTabs>
      </StyledLayoutHeaderContent>
      <Layout.HeaderActions>
        <Actions gap={1}>
          <Button onClick={handleNavigateToSettings} href="#" icon={<IconSettings />}>
            {t('Settings')}
          </Button>

          <CreateRuleButton organization={organization} router={router} />
        </Actions>
      </Layout.HeaderActions>
    </Layout.Header>
  );
};

export default AlertHeader;

const StyledLayoutHeaderContent = styled(Layout.HeaderContent)`
  margin-bottom: 0;
`;

const StyledLayoutTitle = styled(Layout.Title)`
  margin-top: 0;
`;

const StyledNavTabs = styled(NavTabs)`
  margin-top: 15px;
  margin-bottom: 0;
  border-bottom: 0 !important;
  li {
    margin-right: ${space(0.5)};
  }
  li > a {
    padding: ${space(1)} ${space(2)};
  }
`;

const Actions = styled(ButtonBar)`
  height: 32px;
`;
