import React, { useState } from "react";
import { HelpCircle, Trophy, Target, Info } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

export const PickleballScoringGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
      >
        <HelpCircle className="w-4 h-4" />
        <span>Scoring Guide</span>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Pickleball Scoring Rules"
        size="lg"
      >
        <div className="space-y-6">
          {/* Basic Rules */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">
                Basic Scoring Rules
              </h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  Games are played to <strong>11 points</strong>
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  Must win by <strong>at least 2 points</strong> (e.g., 11-9,
                  12-10, 13-11)
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  Matches are typically <strong>best of 3 games</strong>
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-medium">•</span>
                <span>
                  First to win <strong>2 games wins the match</strong>
                </span>
              </li>
            </ul>
          </div>

          {/* Examples */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Scoring Examples</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Valid Game Examples */}
              <div className="space-y-3">
                <h4 className="font-medium text-green-700">
                  ✅ Valid Game Scores:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <span className="font-mono">11-9</span>{" "}
                    <span className="text-green-700">(Win by 2)</span>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <span className="font-mono">12-10</span>{" "}
                    <span className="text-green-700">
                      (Win by 2 in overtime)
                    </span>
                  </div>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <span className="font-mono">15-13</span>{" "}
                    <span className="text-green-700">(Extended game)</span>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                    <span className="font-mono">10-10</span>{" "}
                    <span className="text-yellow-700">(Game continues)</span>
                  </div>
                </div>
              </div>

              {/* Invalid Game Examples */}
              <div className="space-y-3">
                <h4 className="font-medium text-red-700">
                  ❌ Invalid Game Scores:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="bg-red-50 p-2 rounded border border-red-200">
                    <span className="font-mono">11-10</span>{" "}
                    <span className="text-red-700">(Must win by 2)</span>
                  </div>
                  <div className="bg-red-50 p-2 rounded border border-red-200">
                    <span className="font-mono">10-9</span>{" "}
                    <span className="text-red-700">(Neither reached 11)</span>
                  </div>
                  <div className="bg-red-50 p-2 rounded border border-red-200">
                    <span className="font-mono">12-9</span>{" "}
                    <span className="text-red-700">
                      (Game would end at 11-9)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Match Examples */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Match Examples</span>
            </h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">
                  Example Match 1: 2-0 Victory
                </h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium">Game 1</div>
                    <div className="font-mono bg-white p-1 rounded">11-6</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Game 2</div>
                    <div className="font-mono bg-white p-1 rounded">11-9</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Result</div>
                    <div className="text-green-600 font-medium">
                      Player 1 Wins 2-0
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">
                  Example Match 2: 2-1 Victory
                </h4>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="font-medium">Game 1</div>
                    <div className="font-mono bg-white p-1 rounded">8-11</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Game 2</div>
                    <div className="font-mono bg-white p-1 rounded">11-7</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Game 3</div>
                    <div className="font-mono bg-white p-1 rounded">11-9</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">Result</div>
                    <div className="text-green-600 font-medium">
                      Player 1 Wins 2-1
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Automated Winner Detection */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span>Automated Winner Detection</span>
            </h3>
            <p className="text-sm text-green-800 mb-2">
              Our system automatically determines winners based on official
              pickleball rules:
            </p>
            <ul className="space-y-1 text-sm text-green-800">
              <li>
                • Game winners determined when reaching 11+ points with 2+ point
                lead
              </li>
              <li>
                • Match winners determined when winning majority of games (2 out
                of 3)
              </li>
              <li>• Incomplete games and matches are clearly marked</li>
              <li>• Score validation prevents impossible score combinations</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};
