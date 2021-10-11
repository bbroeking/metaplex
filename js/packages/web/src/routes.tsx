import { HashRouter, Route, Switch } from 'react-router-dom';
import { Providers } from './providers';
import {
  AnalyticsView,
  ArtCreateView,
  ArtistsView,
  ArtistView,
  ArtView,
  ArtworksView,
  AuctionCreateView,
  AuctionView,
  HomeView,
} from './views';
import { AdminView } from './views/admin';
import { BillingView } from './views/auction/billing';
import AuctionMaker from './views/auctionMaker';
import { WalletView } from './views/wallet';
import MintMachine from './views/candyMachine';
import PlayPage from './views/play';
import SwapPage from './views/swap';
import StakePage from './views/stake';
import ShopPage from './views/Shop';

export function Routes() {
  return (
    <>
      <HashRouter basename={'/'}>
        <Providers>
          <Switch>
            <Route exact path="/admin" component={() => <AdminView />} />
            <Route
              exact
              path="/analytics"
              component={() => <AnalyticsView />}
            />
            <Route
              exact
              path="/art/create/:step_param?"
              component={() => <ArtCreateView />}
            />
            <Route
              exact
              path="/artworks/:id?"
              component={() => <ArtworksView />}
            />
            <Route exact path="/art/:id" component={() => <ArtView />} />
            <Route exact path="/artists/:id" component={() => <ArtistView />} />
            <Route exact path="/artists" component={() => <ArtistsView />} />
            <Route
              exact
              path="/auction/create/:step_param?"
              component={() => <AuctionCreateView />}
            />
            <Route
              exact
              path="/auction/:id"
              component={() => <AuctionView />}
            />
            <Route
              exact
              path="/auction/:id/billing"
              component={() => <BillingView />}
            />
            <Route
              exact
              path="/wallet"
              component={() => <WalletView />}
            />
            <Route
             exact
             path="/maker"
             component={() => <AuctionMaker />}
            />
            <Route
              exact 
              path="/candy-machine"
              component={() => <MintMachine />}
              />
            <Route
              exact 
              path="/play"
              component={() => <PlayPage />}
              />
            <Route
              exact 
              path="/swap"
              component={() => <SwapPage />}
              />
            <Route
              exact 
              path="/stake"
              component={() => <StakePage />}
              />
             <Route
              exact 
              path="/shop"
              component={() => <ShopPage />}
              />
            <Route path="/" component={() => <HomeView />} />
          </Switch>
        </Providers>
      </HashRouter>
    </>
  );
}
