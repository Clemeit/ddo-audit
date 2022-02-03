exports.isPlayerActive = (
	lastseen,
	lastactive,
	lastmovement,
	lastlevelup,
	totallevel
) => {
	let MOVEMENT_DAY_THRESHOLD = 5;
	let QUESTING_DAY_THRESHOLD = 10;
	let LEVELUP_DAY_THRESHOLD = 20;

	let seen = new Date(lastseen + "Z").getTime();
	let active = lastactive == null ? 0 : new Date(lastactive + "Z").getTime();
	let movement =
		lastmovement == null ? 0 : new Date(lastmovement + "Z").getTime();
	let levelup =
		lastlevelup == null ? 0 : new Date(lastlevelup + "Z").getTime();

	let isactive = true;

	if (seen - movement > 1000 * 60 * 60 * 24 * MOVEMENT_DAY_THRESHOLD)
		isactive = false; // No movement
	if (seen - active > 1000 * 60 * 60 * 24 * QUESTING_DAY_THRESHOLD)
		isactive = false; // No questing
	if (
		totallevel < 30 &&
		seen - levelup > 1000 * 60 * 60 * 24 * LEVELUP_DAY_THRESHOLD
	)
		isactive = false; // No level-ups (level 30s excluded)

	return isactive;
};
