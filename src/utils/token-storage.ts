export const secureStorage = {
	save(keyName: string, token: string) {
		localStorage.setItem(keyName, token);
	},

	get(keyName: string) {
		return localStorage.getItem(keyName);
	},

	remove(keyName: string) {
		localStorage.removeItem(keyName);
	},
};
