import { Network } from './network';
import { Result } from 'neverthrow';

export interface NetworkReadRepository {
	getNetwork(time: Date): Promise<Result<Network | null, Error>>;

	getPreviousNetwork(
		currentNetworkTime: Date
	): Promise<Result<Network | null, Error>>;
}
