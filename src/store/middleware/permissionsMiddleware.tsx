import { Middleware } from '@reduxjs/toolkit';
import { signalingActions } from '../slices/signalingSlice';
import { Logger } from '../../utils/logger';
import { MiddlewareOptions } from '../store';
import { permissionsActions } from '../slices/permissionsSlice';

const logger = new Logger('PermissionsMiddleware');

const createPermissionsMiddleware = ({ signalingService }: MiddlewareOptions) => {
	logger.debug('createPermissionsMiddleware()');

	const middleware: Middleware = ({ dispatch, getState }) =>
		(next) => (action) => {
			if (signalingActions.connected.match(action)) {
				signalingService.on('notification', (notification) => {
					logger.debug(
						'signalingService "notification" event [method:%s, data:%o]',
						notification.method, notification.data);

					try {
						switch (notification.method) {
							case 'signInRequired': {
								dispatch(permissionsActions.setLoggedIn({ loggedIn: false }));
								dispatch(permissionsActions.setSignInRequired({ signInRequired: true }));

								break;
							}

							case 'lockRoom': {
								dispatch(permissionsActions.setLocked({ locked: true }));
			
								break;
							}

							case 'unlockRoom': {
								dispatch(permissionsActions.setLocked({ locked: true }));
	
								break;
							}
						}
					} catch (error) {
						logger.error('error on signalService "notification" event [error:%o]', error);
					}
				});
			}

			if (permissionsActions.setLoggedIn.match(action)) {
				const { loggedIn } = action.payload;
				const { id: peerId } = getState().me;
				const { name: roomId } = getState().room;

				// Login
				if (loggedIn) {
					logger.debug('Login!');
					window.open(`/auth/login?peerId=${peerId}&roomId=${roomId}`, 'loginWindow');
				} else { // Logout
					logger.debug('Logout!');
					window.open(`/auth/logout?peerId=${peerId}&roomId=${roomId}`, 'logoutWindow');
				}
			}

			return next(action);
		};

	return middleware;
};

export default createPermissionsMiddleware;