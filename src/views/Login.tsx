import * as React from 'react';
import {Helmet} from 'react-helmet';
import {withNamespaces, WithNamespaces} from 'react-i18next';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router';
import {withRouter, } from 'react-router-dom';
import {actions, IActions} from '../actions';
import {IState} from '../reducers';

type Props = WithNamespaces & RouteComponentProps & IPropsState & IActions;

class Login extends React.Component<Props, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			password: '',
			username: '',
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
	}
	public render() {
		const {isLoggedIn, t} = this.props;
		return (
			<div>
				<Helmet>
					<title>{t('login')}</title>
				</Helmet>
				{isLoggedIn ? (
					<div>
						<button onClick={this.handleLogout}>{t('logout')}</button>
					</div>
				) : (
					<div>
						Username: <input name="username" type="text" onChange={this.onChange} value={this.state.username} /> <br />
						Password: <input name="password" type="password" onKeyUp={this.onKeyUp} onChange={this.onChange} value={this.state.password} />
						<br />
						<button onClick={this.handleLogin}>{t('login')}</button>
					</div>
				)}
			</div>
		);
	}
	private handleLogin() {
		this.props
			.doLogin(this.state.username, this.state.password)
			.then(() => {
				this.props.history.push('/');
			})
			.catch(() => {
				// ignore
			});
	}
	private handleLogout() {
		this.props
			.doLogout()
			.then(() => {
				this.props.history.push('/');
			})
			.catch(() => {
				// ignore
			});
	}
	private onChange(e: React.FormEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		this.setState({
			[target.name]: target.value,
		});
	}
	private onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.keyCode === 13) {
			e.preventDefault();
			e.stopPropagation();
			e.nativeEvent.stopImmediatePropagation();
			this.handleLogin();
		}
		return false;
	}
}
interface IPropsState {
	isLoggedIn: boolean,
}
const mapStateToProps = (state: IState) => {
	return {isLoggedIn: state.app.isLoggedIn};
};

export default withRouter(connect<IPropsState, any, any>(mapStateToProps,actions)(withNamespaces()(Login)));